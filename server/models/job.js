const pool = require('../config/db');

const newJob = async (
    recruiter_id,
    company_id,
    title,
    description,
    min_salary,
    max_salary,
    experience,
    status,
    required_cv,
    deadline,
    category_id,
) => {
    const result = await pool.query(
        'INSERT INTO job (recruiter_id, company_id, title, description, min_salary, max_salary, experience, status, required_cv, deadline, category_id, requirement, benefit, limited, created_at, updated_at) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW(), NOW()) RETURNING *',
        [
            recruiter_id,
            company_id,
            title,
            description,
            min_salary,
            max_salary,
            experience,
            status || 'open',
            required_cv || false,
            deadline,
            category_id || null,
            requirement,
            benefit,
            limited,
        ],
    );
    return result.rows[0];
};

const getJobById = async (job_id) => {
    try {
        const result = await pool.query(
            'SELECT j.*, c.company_name, c.logo_path, ' +
                'p.name AS province_name, w.name AS ward_name, l.address, ' +
                'cat.name AS category_name ' +
                'FROM job j ' +
                'LEFT JOIN company c ON j.company_id = c.company_id ' +
                'LEFT JOIN location l ON c.location_id = l.location_id ' +
                'LEFT JOIN provinces p ON l.province_code = p.code ' +
                'LEFT JOIN wards w ON l.ward_code = w.code ' +
                'LEFT JOIN category cat ON j.category_id = cat.category_id ' +
                'WHERE j.job_id = $1',
            [job_id],
        );
        return result.rows[0] || null;
    } catch (err) {
        throw new Error(`Lỗi khi lấy việc: ${err.message}`);
    }
};

const getJobsFiltered = async ({
    query: searchQuery,
    min_salary,
    max_salary,
    experience = [],
    category_id = [],
    required_cv,
    province_code,
    ward_code,
    sort_by,
}) => {
    let baseQuery = `
        SELECT j.*, c.company_name, c.logo_path, p.name AS province_name, w.name AS ward_name, l.address, cat.name AS category_name
        FROM job j
        LEFT JOIN company c ON j.company_id = c.company_id
        LEFT JOIN location l ON c.location_id = l.location_id
        LEFT JOIN provinces p ON l.province_code = p.code
        LEFT JOIN wards w ON l.ward_code = w.code
        LEFT JOIN category cat ON j.category_id = cat.category_id
        WHERE j.status = 'open'
    `;

    const queryParams = [];
    let paramIndex = 1;

    // Tìm kiếm theo text tên công việc hoặc công ty
    if (searchQuery?.trim()) {
        baseQuery += ` AND (LOWER(j.title) ILIKE $${paramIndex} OR LOWER(c.company_name) ILIKE $${paramIndex})`;
        queryParams.push(`%${searchQuery.toLowerCase()}%`);
        paramIndex++;
    }

    // Tìm kiếm theo lương
    if (min_salary) {
        baseQuery += ` AND j.min_salary >= $${paramIndex}`;
        queryParams.push(parseFloat(min_salary));
        paramIndex++;
    }

    if (max_salary) {
        baseQuery += ` AND j.max_salary <= $${paramIndex}`;
        queryParams.push(parseFloat(max_salary));
        paramIndex++;
    }

    // Theo kinh nghiệm
    if (experience && experience.length > 0 && experience[0] !== '') {
        const validLevels = experience.filter((level) => level !== '');
        if (validLevels.length > 0) {
            const placeholders = validLevels.map(() => `$${paramIndex++}`).join(',');
            baseQuery += ` AND j.experience IN (${placeholders})`;
            queryParams.push(...validLevels);
        }
    }

    // Theo danh mục
    if (category_id && category_id.length > 0 && category_id[0] !== '') {
        const validCategories = category_id.filter((id) => id !== '' && !isNaN(id));
        if (validCategories.length > 0) {
            const placeholders = validCategories.map(() => `$${paramIndex++}`).join(',');
            baseQuery += ` AND j.category_id IN (${placeholders})`;
            queryParams.push(...validCategories.map((id) => parseInt(id)));
        }
    }

    // Theo địa điểm
    if (province_code && province_code !== '000' && province_code !== '') {
        baseQuery += ` AND l.province_code = $${paramIndex}`;
        queryParams.push(province_code);
        paramIndex++;
    }
    if (ward_code && ward_code !== '') {
        baseQuery += ` AND l.ward_code = $${paramIndex}`;
        queryParams.push(ward_code);
        paramIndex++;
    }

    // CV có cần thiết không
    if (required_cv !== undefined && required_cv !== '') {
        baseQuery += ` AND j.required_cv = $${paramIndex}`;
        queryParams.push(required_cv === 'true');
        paramIndex++;
    }

    // Sắp xếp
    if (sort_by === 'salary_asc') {
        baseQuery += ' ORDER BY j.min_salary ASC';
    } else if (sort_by === 'salary_desc') {
        baseQuery += ' ORDER BY j.max_salary DESC';
    } else {
        baseQuery += ' ORDER BY j.updated_at DESC';
    }

    try {
        console.log('Executing query:', baseQuery, 'with params:', queryParams);
        const result = await pool.query(baseQuery, queryParams);
        return result.rows;
    } catch (err) {
        console.error('Error executing query:', baseQuery, queryParams, err.message);
        throw err;
    }
};

const getJobsByCompany = async (company_id) => {
    const query = `
            SELECT 
                j.*,
                cat.name AS category_name,
                p.name AS province_name
            FROM job j
            JOIN category cat ON j.category_id = cat.category_id
            JOIN company c ON j.company_id = c.company_id
            JOIN location l ON c.location_id = l.location_id
            JOIN provinces p ON l.province_code = p.code
            WHERE j.company_id = $1
            ORDER BY j.created_at DESC
        `;
    const result = await pool.query(query, [company_id]);
    return result.rows;
};

const getRelatedJobs = async (job_id) => {
    try {
        const query = `
            SELECT 
                j.*,
                c.*,
                p.name AS province_name,
                cat.name AS category_name
            FROM job j
            JOIN company c ON j.company_id = c.company_id
            JOIN location l ON c.location_id = l.location_id
            JOIN provinces p ON l.province_code = p.code
            JOIN category cat ON j.category_id = cat.category_id
            WHERE 
                j.category_id = (
                    SELECT j2.category_id 
                    FROM job j2 
                    JOIN company c2 ON j2.company_id = c2.company_id
                    JOIN location l2 ON c2.location_id = l2.location_id
                    WHERE j2.job_id = $1
                )
                AND l.province_code = (
                    SELECT l2.province_code 
                    FROM job j2 
                    JOIN company c2 ON j2.company_id = c2.company_id
                    JOIN location l2 ON c2.location_id = l2.location_id
                    WHERE j2.job_id = $1
                )
                AND j.job_id != $1
                AND j.status = 'open'
            ORDER BY j.updated_at DESC
            LIMIT 12
        `;
        const result = await pool.query(query, [job_id]);
        return result.rows;
    } catch (err) {
        throw new Error(`Lỗi khi lấy công việc liên quan: ${err.message}`);
    }
};

const updateJobStatus = async (job_id, status) => {
    const result = await pool.query(
        'UPDATE job SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE job_id = $2 RETURNING *',
        [status, job_id],
    );
    return result.rows[0];
};

const getAllCategories = async () => {
    const query = await pool.query('SELECT * FROM category');
    return query.rows;
};

module.exports = {
    newJob,
    getJobById,
    getJobsFiltered,
    updateJobStatus,
    getAllCategories,
    getJobsByCompany,
    getRelatedJobs,
};
