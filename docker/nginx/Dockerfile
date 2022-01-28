FROM nginx:alpine

RUN rm /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d /etc/nginx/conf.d
COPY public /etc/nginx/conf.d/public

# https://github.com/docker-library/docs/tree/master/nginx#using-environment-variables-in-nginx-configuration-new-in-119
ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/conf.d
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
