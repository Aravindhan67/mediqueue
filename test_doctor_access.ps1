# Test Doctor Access
$baseUrl = "http://localhost/hospital-backend/api"
$email = "doctor@mediqueue.com"
$password = "doctor123"

# 1. Login
Write-Host "1. Logging in as Doctor..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login.php" -Method Post -Body (@{email=$email; password=$password} | ConvertTo-Json) -ContentType "application/json"
    if ($response.success) {
        $token = $response.data.token
        $headers = @{Authorization="Bearer $token"}
        Write-Host "Login Success. Token: $token"
    } else {
        Write-Error "Login Failed: $($response.message)"
        exit
    }
} catch {
    Write-Host "Login Request Failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Server Response: $($reader.ReadToEnd())"
    }
    exit
}

# 2. Access Doctor Appointments
Write-Host "`n2. Accessing Appointments..."
try {
    $appts = Invoke-RestMethod -Uri "$baseUrl/appointments/doctor.php" -Method Get -Headers $headers
    Write-Host "Success! Found $($appts.data.Count) appointments."
    $appts.data | Format-Table -AutoSize
} catch {
    Write-Host "Error accessing appointments: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Server Response: $($reader.ReadToEnd())"
    }
}
