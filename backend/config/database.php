<?php
/**
 * Database Configuration
 * Update these values according to your XAMPP setup
 */

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'mediqueue');

// JWT Secret Key (Change this in production)
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your_secret_key_change_this_in_production');

/**
 * Database Connection Class
 */
class Database
{
    private $conn;

    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Connection Error: " . $e->getMessage());
        }

        return $this->conn;
    }
}
?>