CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, 
    threshold_type VARCHAR(50) NOT NULL,  
    target_value DECIMAL(18, 2) NOT NULL,
    coin_name VARCHAR(100) NOT NULL,
    coin_symbol VARCHAR(10) NOT NULL,
    coin_image VARCHAR(100) NOT NULL,
    last_triggered TIMESTAMP
);
