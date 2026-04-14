# Use the official PHP image with Apache
FROM php:8.2-apache

# Install the PDO and PDO MySQL extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache mod_rewrite for nice URLs if needed
RUN a2enmod rewrite

# Copy all the backend source files into the Apache document root
COPY . /var/www/html/

# Set proper ownership for Apache to read/write files
RUN chown -R www-data:www-data /var/www/html

# FIX FOR RAILWAY PORT AND CRASH:
# Railway injects the $PORT environment variable at *runtime*, not build time.
# By replacing the port only in the CMD, we prevent the Apache port configuration
# from corrupting during the build phase (which was causing it to crash with MPM errors).
CMD sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf && docker-php-entrypoint apache2-foreground