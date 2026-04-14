# Use the official PHP image with Apache
FROM php:8.2-apache

# Install the PDO and PDO MySQL extensions
RUN docker-php-ext-install pdo pdo_mysql

# 修复 MPM 冲突：显式禁用 event 模式，确保只运行 prefork
RUN a2dismod mpm_event || true && a2enmod mpm_prefork

# Configure Apache to use the dynamic port provided by Railway ($PORT)
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Enable Apache mod_rewrite for nice URLs if needed
RUN a2enmod rewrite

# Copy all the backend source files into the Apache document root
COPY . /var/www/html/

# Set proper ownership for Apache to read/write files (especially important if uploading photos)
RUN chown -R www-data:www-data /var/www/html

# 关键修正：使用 ENTRYPOINT 或修改启动方式来确保 $PORT 被正确替换
CMD sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf && \
    sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/000-default.conf && \
    apache2-foreground