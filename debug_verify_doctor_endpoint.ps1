$baseUrl = "http://localhost/hospital-backend/api"
$email = "doctor@mediqueue.com"
$password = "doctor123"

# Login
Write-Host "Logging in as Doctor..."
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login.php" -Method Post -Body (@{email=$email;password=$password}|ConvertTo-Json) -ContentType "application/json"
    $token = $loginResponse.data.token
    Write-Host "Login Success."
    
    # Decode token to verify payload
    $payload = $token.Split('.')[1]
    switch ($payload.Length % 4) {
        2 { $payload += "==" }
        3 { $payload += "=" }
    }
    $decodedBytes = [System.Convert]::FromBase64String($payload)
    $decodedText = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
    Write-Host "Token Payload: $decodedText"

} catch {
    Write-Error "Login Failed: $($_.Exception.Message)"
    exit 1
}

$headers = @{Authorization="Bearer $token"}

# Test doctor.php
Write-Host "`nTesting GET appointments/doctor.php..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/appointments/doctor.php" -Method Get -Headers $headers
    Write-Host "Success!"
    Write-Host ($response | ConvertTo-Json -Depth 5)
} catch {
    Write-Error "Failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
         $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
         Write-Host "Body: $($reader.ReadToEnd())"
    }
}

# Test prescriptions/list.php
Write-Host "`nTesting GET prescriptions/list.php..."
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/prescriptions/list.php" -Method Get -Headers $headers
    Write-Host "Success!"
    Write-Host ($response | ConvertTo-Json -Depth 5)
} catch {
    Write-Error "Failed: $($_.Exception.Message)"
    if ($_.Exception.Response) {
         $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
         Write-Host "Body: $($reader.ReadToEnd())"
    }
}
