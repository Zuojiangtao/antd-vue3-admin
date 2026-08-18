FROM hb.h3c.com/eos/base/nginx:1.22.1

USER root
RUN rm -v /etc/nginx/conf.d/default.conf

ADD ./deploy/default.conf /etc/nginx/conf.d/
COPY dist/. /usr/share/nginx/html/
RUN rm -rf /usr/share/nginx/html/.git
EXPOSE 80