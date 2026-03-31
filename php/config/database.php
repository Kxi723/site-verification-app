<?php

class Database {
    // Database credentials
    private $host = "localhost";
    private $db_name = "intern_apr2026"; 
    private $username = "root";  
    private $password = "123";
    private $charset = 'utf8mb4';
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            // Data Source Name
            $dsn = "mysql:host=$this->host;dbname=$this->db_name;charset=$this->charset";

            // Error handling & performance
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Fetch associative arrays
                PDO::ATTR_EMULATE_PREPARES => false, // Use native prepared statements
            ];

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } 
        catch(PDOException $exception) {
            echo json_encode([
                "success" => false, 
                "message" => "Database connection failed: " . $exception->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}
?>
