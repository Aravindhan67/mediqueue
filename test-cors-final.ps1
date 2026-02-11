Write-Host "Testing CORS with new handler..."
Write-Host ""

$headers = @{
    "Origin" = "http://localhost:5173"
    "Access-Control-Request-Method" = "POST"
    "Access-Control-Request-Headers" = "Content-Type"
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost/hospital-backend/api/auth/register.php" -Method OPTIONS -Headers $headers -UseBasicParsing
    
    Write-Host "✓ Status Code: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    Write-Host "CORS Headers Check:" -ForegroundColor Yellow
    
    $corsHeaders = @(
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Credentials"
    )
    
    foreach($headerName in $corsHeaders) {
        if ($response.Headers[$headerName]) {
            Write-Host "  ✓ $headerName : $($response.Headers[$headerName])" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $headerName : NOT FOUND" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
}
