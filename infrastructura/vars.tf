variable "access_key" {
  description = "ACCESS KEY AWS"
  type        = string
}

variable "secret_key" {
  description = "SECRET KEY AWS"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1" # Cambia a tu región preferida
}

variable "bucket_name" {
  description = "Name of the S3 bucket"
  type        = string
  default     = "retrotv_bucket" # Cambia al nombre deseado
}

variable "cloudfront_key_pair_id" {
  description = "CloudFront Key Pair ID"
  type        = string
  default     = "claves_retrotv" # Cambia al ID de tu par de claves
}

variable "cloudfront_public_key_path" {
  description = "Path to the CloudFront public key file"
  type        = string
  default     = "public_retrotv_key.pem" # Cambia a la ubicación de tu clave pública
}

variable "cloudfront_private_key_path"{
    description = "Path to the CloudFront private key file"
    type = string
    default = "private_retrotv_key.pem"
}