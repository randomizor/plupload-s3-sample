##SETUP

Set your bucket, access key and secret key in config/settings.yml

Ensure your S3 bucket has a CORS configuration set that allows the POST method. Sample configuration below (in a production environment, you'll want to restrict the allowed origins).


```
<? xml version="1.0" encoding="UTF-8" ?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```