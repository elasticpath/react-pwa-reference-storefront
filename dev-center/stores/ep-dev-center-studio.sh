#!/usr/bin/env bash

set -e

current_script_name="$(basename ${BASH_SOURCE})"

stack_name="${current_script_name%%.*}-$(/bin/date +%Y%m%d%H%M%S)"
template_body_path="file://${current_script_name%%.*}.yaml"
current_cidr="$(curl -s http://whatismyip.akamai.com/)/32"


echo "Validating template..."

aws cloudformation validate-template \
    --template-body "${template_body_path}" \

if [ $? -eq 0 ]; then
  echo "Stack validated!"
else
  >&2 echo "Stack validation failed!"
fi

echo "Creating stack..."

aws cloudformation create-stack \
    --stack-name "${stack_name}" \
    --parameters \
      ParameterKey=InstanceTagName,ParameterValue="${stack_name}" \
      ParameterKey=SshCidr,ParameterValue="${current_cidr}" \
    --template-body "${template_body_path}" \
    --capabilities CAPABILITY_IAM

echo "Waiting for stack-create-complete..."

aws cloudformation wait stack-create-complete --stack-name "${stack_name}"

if [ $? -eq 0 ]; then
  echo "Stack created!"
else
  >&2 echo "Failed to create stack!"
fi

app_server_ip=$(aws cloudformation describe-stacks --stack-name $stack_name --query 'Stacks[0].Outputs[?OutputKey==`PublicIp`].OutputValue' --output text)

echo "${app_server_ip}"
