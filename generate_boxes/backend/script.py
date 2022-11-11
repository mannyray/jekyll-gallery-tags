import json
import os
import yaml


json_directory = input("Enter the path of your directory:")
yaml_directory = input("Enter the path of your output directory:")

to_yaml_res = []
for file in os.listdir(json_directory):
    if file.endswith('.json'):
        data = json.load(open(json_directory+'/'+file))
        data = data[0]
        to_yaml_res.append(data)
with open(yaml_directory+'/result.yml','w') as yaml_file:
    yaml.dump(to_yaml_res,yaml_file,default_flow_style=False)
