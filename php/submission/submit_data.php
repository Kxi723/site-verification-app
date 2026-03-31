<?php
// 允许跨域请求 (CORS) - 开发期间经常需要跨域
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// 处理 OPTIONS 预检请求
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// embed PHP code from another file
include_once '../config/database.php';

// 显示完整的错误信息（便于开发时调试，正式上线时可以关闭）
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Initialise
$database = new Database();
$db = $database->getConnection();

// 获取前端传过来的普通表单数据 (formData)
$jobNumber = $_POST['jobNumber'] ?? '';
$siteLocation = $_POST['siteLocation'] ?? '';
$jobType = $_POST['jobType'] ?? '';
$completionDate = $_POST['completionDate'] ?? '';
$completionTime = $_POST['completionTime'] ?? '';
$notes = $_POST['notes'] ?? '';
$contractorCompany = $_POST['contractorCompany'] ?? '';
$personnelNames = $_POST['personnelNames'] ?? []; // 因为前端传递的是 personnelNames[]，所以这里获取到的是数组

// 简单的数据校验
if (empty($jobNumber) || empty($siteLocation) || empty($completionDate)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit();
}

// Note: removed uniqid() as the database table `id` is an auto-incrementing integer!

// 【修改点1】：不再把图片存入服务器硬盘，而是直接读取它的二进制数据
$photoBlob = null;
if (isset($_FILES['photoFile']) && $_FILES['photoFile']['error'] === UPLOAD_ERR_OK) {
    // file_get_contents 将文件读取为二进制字符串，之后存入 LONGBLOB 字段
    $photoBlob = file_get_contents($_FILES['photoFile']['tmp_name']);
}

// -------------------------------------------------------------
// 【修改点2】：调整 SQL 插入语句和参数
// 1. 我增加了一个 photo_data 字段来存你的 LONGBLOB 图片。
//    (如果你的数据库里不叫 photo_data 请自己改一下下面这两处的名字)
// 2. 刚刚您修改时 VALUES 里的问号数量和栏位数量对不上了，我帮您修正了。
// -------------------------------------------------------------
try {
    $query = "INSERT INTO job_submission 
              (job_number, job_type, site_location, completion_date, completion_time, 
               contractor_company, job_notes, photo, team_personnel, sync_status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
    
    $stmt = $db->prepare($query);
    
    // 执行插入
    $stmt->execute([
        $jobNumber,                                 // 1. job_number
        $jobType,                                   // 2. job_type
        $siteLocation,                              // 3. site_location
        $completionDate,                            // 4. completion_date
        $completionTime,                            // 5. completion_time
        $contractorCompany,                         // 6. contractor_company
        $notes,                                     // 7. job_notes
        $photoBlob,                                 // 8. photo_data (LONGBLOB)
        json_encode($personnelNames, JSON_UNESCAPED_UNICODE), // 9. team_personnel
    ]);
    
    // 获取自动生成的数据库 ID
    $newId = $db->lastInsertId();
    
    // 如果插入成功，返回成功标识 
    // JSON 返回格式必须和前端要求的 { success: true, jobId: "xxx" } 吻合
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "jobId" => $newId, // 返回数据库生成的自增 ID
        "message" => "Job record and photo successfully saved directly into DB!"
    ]);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "SQL Error: " . $e->getMessage()]);
}
?>
