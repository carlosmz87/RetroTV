output "bucket_name" {
  value = aws_s3_bucket.retrotv_bucket.id
}

output "bucket_domain_name" {
  value = aws_s3_bucket.retrotv_bucket.bucket_regional_domain_name
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.cloudfront_distribution.domain_name
}
