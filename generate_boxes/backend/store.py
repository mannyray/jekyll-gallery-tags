import glob
import os
import pickle
import shutil
from werkzeug.utils import secure_filename
from flask import send_file
import json


'''
[
   ...
   {
      "name":"IMG_123.JPG",
      "caption":"some text bla bla",
      "year":"2020",
      "month":"7"
   }  
   ...
]
'''


folderToDictionary = {}
tagToImages = {}

def get_json_file_path(image_folder_path,image_name):
    return os.path.join(image_folder_path,image_name+'data.json')

def get_image(current_session_path,image_name):
    return send_file(os.path.join(current_session_path,image_name), mimetype='image/jpg')
    
'''
with open(json_file_path, 'r') as j:
     contents = json.loads(j.read())
'''
   
def get_json_file(json_path,image_name):
    with open(get_json_file_path(json_path,image_name), 'r') as j:
        return json.loads(j.read())

def save_json_file(json_path,image_name,data):
    with open(get_json_file_path(json_path,image_name), 'w') as f:
        json.dump(data, f)
        
def get_image_info(json_path,image_name):
    try:
        data = get_json_file(json_path,image_name)
    except:
         return {}
    for single_image_info in data:
        if image_name in single_image_info['name']:
            return single_image_info
    return {}
    
def save_image_info(json_path,image_name, caption, year, month, x, y, width, actual_image_width, actual_image_height):
    if not os.path.isfile(get_json_file_path(json_path,image_name)):
        save_json_file(json_path,image_name,[])
    data = get_json_file(json_path,image_name)
    found = False
    for single_image_info_index in range(0,len(data)):
        if image_name in data[single_image_info_index]['name']:
            found = True
            data[single_image_info_index]['name'] = image_name
            data[single_image_info_index]['caption'] = caption
            data[single_image_info_index]['year'] = year
            data[single_image_info_index]['month'] = month
            data[single_image_info_index]['x'] = x
            data[single_image_info_index]['y'] = y
            data[single_image_info_index]['width'] = width
            data[single_image_info_index]['actual_width'] = actual_image_width
            data[single_image_info_index]['actual_height'] = actual_image_height
            break
    if not found:
        image_info = {}
        image_info['name'] = image_name
        image_info['caption'] = caption
        image_info['year'] = year
        image_info['month'] = month
        image_info['x'] = x
        image_info['y'] = y
        image_info['width'] = width
        image_info['actual_width'] = actual_image_width
        image_info['actual_height'] = actual_image_height
        data.append(image_info)
    save_json_file(json_path,image_name,data)
    return
    
    
    
    
