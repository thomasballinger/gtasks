
build:
	webpack

deploy: index.html
	aws s3 cp index.html 's3://next.ballingt.com'
	aws s3 cp update.js 's3://next.ballingt.com'
	aws s3 cp auth.js 's3://next.ballingt.com'
	aws s3 cp views.js 's3://next.ballingt.com'
