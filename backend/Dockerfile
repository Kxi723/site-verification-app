# 使用官方自带 Apache 的 PHP 8.2 镜像
FROM php:8.2-apache

# 安装云端数据库必不可少的 PDO 和 PDO MySQL 扩展
RUN docker-php-ext-install pdo pdo_mysql

# [超级稳妥的端口设置方法]
# 1. 强制在配置里将数字 80 替换成为变量名 ${PORT}（注意这里严格使用单引号，避免在打包时就被解析为空）
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# 2. 告诉 Apache 启动时从操作系统的环境变量里也就是 Railway 给的环境中去读取 $PORT（如果没有就默认 8080）
# 这个才是最标准的做法，彻底避免使用 CMD sed 造成的行过长或者疯狂重启循环替换的毛病
RUN echo "export PORT=\${PORT:-8080}" >> /etc/apache2/envvars

# 开启基于 URL 的重写规则 (可选但推荐)
RUN a2enmod rewrite

# 拷贝你的 php 代码进来
COPY . /var/www/html/

# 赋予正确的权限，避免图片上传报错
RUN chown -R www-data:www-data /var/www/html

# 我们不再需要自定义 CMD，直接让他用默认的安全方式启动！