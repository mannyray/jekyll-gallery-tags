import json
import os
import yaml


json_directory = input("Enter the path of your directory:")
yaml_directory = input("Enter the path of your output directory:")

cover_image = ''
image_list = []
for file in os.listdir(json_directory):
    if file.endswith('.json'):
        print(file)
        data = json.load(open(json_directory+'/'+file))[0]
        keys = []
        for key in data:
            keys.append(key)
        for key in keys:
            if key not in ['year','month','caption','name']:
                data.pop(key)
        name_split = data['name'].split('.')
        data['thumbnail'] = 'thumbnail/'+name_split[0]+'_thumb.'+name_split[1]
        image_list.append(data)
        if len(cover_image) == 0:
            cover_image = data['thumbnail']
to_yaml_res = {'images':image_list,'cover':cover_image}
with open(yaml_directory+'/result.yml','w') as yaml_file:
    yaml.dump(to_yaml_res,yaml_file,default_flow_style=False)
