FROM nginx:latest

COPY ./docker/nginx/config/default.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
