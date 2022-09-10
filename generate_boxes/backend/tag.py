from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import pickle
import os.path
import numpy as np
import shutil
import glob
import store
from filelock import FileLock
from PIL import Image
import PIL, sys

import glob, os

app = Flask(__name__)

@app.route('/load_path',methods=['POST'])
def fileUpload():
    os.chdir(request.args.get('path',default='',type=str))
        
    response = jsonify(glob.glob("*.jpg"))
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/get_specific_image',methods=['GET'])
def get_specific_image():
    return store.get_image(request.args.get('path',default='',type=str),request.args.get('image',default='',type=str))
    
@app.route('/save_image_info',methods=['POST'])
def save_image_info():
    print(request.args)
    path = request.args.get('path',default='',type=str)
    image_name = request.args.get('image',default='',type=str)
    image_path = os.path.join(path,image_name)
    thumbnail_path = os.path.join(path,'thumbnail')
    thumbnail_info_path = os.path.join(path,'thumbnail_info')
    
    year = request.args.get('year',default='',type=str)
    month = request.args.get('month',default='',type=str)
    
    caption=request.args.get('caption',default='',type=str)
    
    if not os.path.exists(image_path):
    	return jsonify(['failed'])
    if not os.path.exists(thumbnail_path):
    	os.makedirs(thumbnail_path)
    if not os.path.exists(thumbnail_info_path):
    	os.makedirs(thumbnail_info_path)

    #with FileLock(data_thumbnail_path):
    if True:
        #print("Lock acquired.")
        #if not os.path.exists(data_thumbnail_path):
        #    print("File does not exist")
        #else:
        image = Image.open(image_path)
        coordinate_info_str = request.args.get('thumbnail',default='')
        coordinate_info = coordinate_info_str.split('_')
	    
        image_height_in_browser = float(request.args.get('image_height'))
        image_width_in_browser = float(request.args.get('image_width'))
	    
        x = int(float(coordinate_info[0])/image_width_in_browser*image.size[0])
        y = int(float(coordinate_info[1])/image_height_in_browser*image.size[1])
        width = int(float(coordinate_info[2])/image_width_in_browser*image.size[0])
        height = int(float(coordinate_info[2])/image_height_in_browser*image.size[1])
        #each image needs (image_name,thumbnail,caption)
        #you have to load it and append your stuff and then save
	    
        box = (x,y, x+width, y+height)
        store.save_image_info(path,image_name,caption,year,month,x,y,width,image.size[0],image.size[1])
        crop = image.crop(box)
        basename_image = image_name.split('.')[0]
        basename_ext = image_name.split('.')[1]
        format_save = basename_ext.upper()
        if format_save == 'JPG':
            format_save = 'JPEG'
        crop.save(os.path.join(thumbnail_path,basename_image+'_thumb.'+basename_ext),format_save)
    #print("Lock released.")   
    response = jsonify([])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
    
@app.route('/get_image_info',methods=['GET'])
def get_image_info():
    #need to get the ratio with respect to actual image
    path = request.args.get('path',default='',type=str)
    image_name = request.args.get('image',default='',type=str)
    image_info = store.get_image_info(path,image_name)
    #TODO return the actual size
    print(image_info)
    if not (len(image_info) == 0):
        response =  jsonify(image_info)
    else:
        response = jsonify([])
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
    
    
