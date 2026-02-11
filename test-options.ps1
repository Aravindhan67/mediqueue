$headers = @{
    "Origin" = "http://localhost:5173"
    "Access-Control-Request-Method" = "POST"
    "Access-Control-Request-Headers" = "Content-Type"
}

Write-Host "Testing OPTIONS request to register.php...`n"
try {
    $response = Invoke-WebRequest -Uri "http://localhost/hospital-backend/api/auth/register.php" -Method OPTIONS -Headers $headers -UseBasicParsing
    Write-Host "Status Code: $($response.StatusCode)`n"
    Write-Host "All Response Headers:"
    foreach($header in $response.Headers.Keys) {
        Write-Host "  $header : $($response.Headers[$header])"
    }
    
    Write-Host "`nLooking for CORS headers:"
    if ($response.Headers["Access-Control-Allow-Origin"]) {
        Write-Host "  ✓ Access-Control-Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])"
    } else {
        Write-Host "  ✗ Access-Control-Allow-Origin: NOT FOUND!"
    }
    
    if ($response.Headers["Access-Control-Allow-Methods"]) {
        Write-Host "  ✓ Access-Control-Allow-Methods: $($response.Headers['Access-Control-Allow-Methods'])"
    } else {
        Write-Host "  ✗ Access-Control-Allow-Methods: NOT FOUND!"
    }
} catch {
    Write-Host "Error: $_"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
        Write-Host "Headers:"
        $_.Exception.Response.Headers | Format-List
    }
}
