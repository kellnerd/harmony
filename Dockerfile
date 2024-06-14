FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno cache server/main.ts

ARG version
ENV DENO_DEPLOYMENT_ID $version
CMD deno run -A server/main.ts
