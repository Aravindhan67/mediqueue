try {
    $body = @{email='doctor@mediqueue.com';password='doctor123'} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri 'http://localhost/hospital-backend/api/auth/login.php' -Method Post -Body $body -ContentType 'application/json'
    Write-Host "Success: $($response | ConvertTo-Json -Depth 5)"
} catch {
    Write-Host "Code: $($_.Exception.Response.StatusCode)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Body: $($reader.ReadToEnd())"
    } else {
        Write-Host "Exception: $($_.Exception.Message)"
    }
}
