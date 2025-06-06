FROM denoland/deno:alpine-1.44.4

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno cache server/main.ts

ARG version
ENV DENO_DEPLOYMENT_ID $version
USER deno:deno
CMD deno run -A server/main.ts
