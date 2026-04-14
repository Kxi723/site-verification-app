FROM php:8.2-apache

# ✅ Fix MPM conflict
RUN a2dismod mpm_event 2>/dev/null || true \
    && a2enmod mpm_prefork

# Install PDO MySQL
RUN apt-get update && apt-get install -y libssl-dev \
    && docker-php-ext-install pdo pdo_mysql

# Enable rewrite
RUN a2enmod rewrite

# Copy code
COPY . /var/www/html/

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# ✅ 精准替换：只改 "Listen 80" 这一行，避免重复替换问题
CMD bash -c "sed -i \"s/Listen 80/Listen \${PORT:-8080}/g\" /etc/apache2/ports.conf \
    && sed -i \"s/:80>/:${PORT:-8080}>/g\" /etc/apache2/sites-available/000-default.conf \
    && apache2-foreground"