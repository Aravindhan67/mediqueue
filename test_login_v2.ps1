# test_login_v2.ps1
$baseUrl = "http://localhost/hospital-backend/api"
$body = @{
    email = "admin@mediqueue.com"
    password = "admin123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login.php" -Method Post -Body $body -ContentType "application/json"
    echo "Login Success!"
    $response | ConvertTo-Json
} catch {
    echo "Login Failed!"
    $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.ReadToEnd()
    }
}
