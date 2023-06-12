resource "aws_cloudfront_public_key" "cloudfront_public_key" {
  encoded_key = file("public_retrotv_key.pem")
  comment     = "Public Key for RetroTV distribution"
}

resource "aws_cloudfront_key_group" "cloudfront_key_group" {
  name  = "RetrotvKeyGroup"
  items = [aws_cloudfront_public_key.cloudfront_public_key.id]
}

resource "aws_cloudfront_origin_access_identity" "cloudfront_access_identity" {
  comment = "CloudFront Origin Access Identity for RetroTV bucket"
}

resource "aws_cloudfront_distribution" "cloudfront_distribution" {
  origin {
    domain_name = aws_s3_bucket.retrotv_bucket.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.retrotv_bucket.id}"
  }

  enabled             = true
  is_ipv6_enabled     = true

  default_cache_behavior {
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    target_origin_id         = "S3-${aws_s3_bucket.retrotv_bucket.id}"
    viewer_protocol_policy   = "redirect-to-https"

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true 
  }
}
