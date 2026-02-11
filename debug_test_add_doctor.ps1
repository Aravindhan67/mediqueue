# debug_test_add_doctor.ps1

$baseUrl = "http://localhost/hospital-backend/api"
$email = "admin@mediqueue.com"
$password = "admin123"

# 1. Login to get Token
echo "Logging in as Admin..."
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login.php" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.data.token
    echo "Login Successful. Token received."
} catch {
    echo "Login Failed: $($_.Exception.Message)"
    exit
}

# 2. Add New Doctor
echo "`nAdding New Doctor..."
$newDoctorEmail = "newdoctor$(Get-Random)@mediqueue.com"
$doctorBody = @{
    name = "Dr. Test PowerShell"
    email = $newDoctorEmail
    password = "password123"
    specialization = "General Tester"
    experience = 5
} | ConvertTo-Json

$headers = @{
    Authorization = "Bearer $token"
}

try {
    $addResponse = Invoke-RestMethod -Uri "$baseUrl/admin/add-doctor.php" -Method Post -Body $doctorBody -Headers $headers -ContentType "application/json"
    
    if ($addResponse.success) {
        echo "SUCCESS: Doctor added successfully!"
        echo "New Doctor Email: $newDoctorEmail"
    } else {
        echo "FAILED: API returned success=false"
        echo $addResponse
    }
} catch {
    echo "FAILED: Request error"
    echo $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.ReadToEnd()
    }
}
