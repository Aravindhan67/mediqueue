# debug_test_markers_v2.ps1

$baseUrl = "http://localhost/hospital-backend/api"
$email = "admin@mediqueue.com"
$password = "admin123"

# 1. Login
echo "Logging in..."
$loginBody = @{ email = $email; password = $password } | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login.php" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
echo "Token: $token"

# 2. Test Markers Endpoint
echo "`nTesting Markers V2..."
$doctorBody = @{
    name = "Dr. Marker"
    email = "marker$(Get-Random)@test.com"
    password = "pass"
    specialization = "Marking"
    experience = 1
} | ConvertTo-Json

$headers = @{ Authorization = "Bearer $token" }

try {
    # Use Invoke-WebRequest to get raw content including markers
    $response = Invoke-WebRequest -Uri "$baseUrl/admin/add-doctor-markers-v2.php" -Method Post -Body $doctorBody -Headers $headers -ContentType "application/json"
    echo "RESPONSE CONTENT:"
    echo $response.Content
} catch {
    echo "FAILED with Status: $($_.Exception.Response.StatusCode)"
    echo "RESPONSE STREAM:"
    $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
    $reader.ReadToEnd()
}
