$baseUrl = "http://localhost/hospital-backend/api"
$email = "admin@mediqueue.com"
$password = "admin123"

# Login
Write-Host "Logging in as Admin..."
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
    if ($_.Exception.Response) {
         $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
         Write-Host "Body: $($reader.ReadToEnd())"
    }
    exit 1
}
