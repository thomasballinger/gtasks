
build:
	echo nothing to do

deploy: index.html
	aws s3 cp index.html 's3://next.ballingt.com'
