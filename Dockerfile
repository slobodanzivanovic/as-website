FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install zip pdo pdo_mysql

RUN a2enmod rewrite headers

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN echo "error_reporting = E_ALL" >> /usr/local/etc/php/conf.d/docker-php-error-reporting.ini \
    && echo "display_errors = On" >> /usr/local/etc/php/conf.d/docker-php-error-reporting.ini \
    && echo "log_errors = On" >> /usr/local/etc/php/conf.d/docker-php-error-reporting.ini \
    && echo "error_log = /dev/stderr" >> /usr/local/etc/php/conf.d/docker-php-error-reporting.ini

RUN chown -R www-data:www-data /var/www/html

COPY docker/apache-config.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html