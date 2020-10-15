ARG NGINX_IMAGE

FROM ${NGINX_IMAGE}

COPY nginx.conf /etc/nginx/nginx.conf

# Start nginx when the container has been provisioned.
CMD ["nginx", "-g", "daemon off;"]
