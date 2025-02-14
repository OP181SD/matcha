FROM nginx:latest


COPY ./docker/nginx/config/default.conf /etc/nginx/nginx.conf

COPY ./frontend/build /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
