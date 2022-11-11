require 'mini_magick'
require 'fileutils'
require "json"
require 'yaml'


  
  module GalleryTag
  
 
  
    class GalleryTagGenerator < Jekyll::Generator
      safe true
      
      # generate the thumbnails/ could be a separate script really outside of this
      def prepare(site,config)       
        dir = config["dir"]
        
        thumbnail_directory = File.join("thumbnails")#TODO better way to get _site?
        FileUtils.mkpath(thumbnail_directory)
        Dir.glob dir+'/*' do |gallery_dir|
        
          if not gallery_dir.end_with?("russia")
            next
          end
          gallery_path = gallery_dir
          
	  Dir.glob gallery_dir+'/*' do |img_dir|#TODO only JPGs...
            if not img_dir.end_with?("jpg") and not img_dir.end_with?("JPG") and not img_dir.end_with?("png")
               next
            end
            name = img_dir.split(".")
            if name.length() != 2
              next
            end
            basename = name[0].split('/')
            basename = basename[-1]

            image = MiniMagick::Image.open(File.join(File.join(gallery_path,"thumbnail"),basename+"_thumb."+name[1]))
            FileUtils.mkpath(File.join("thumbnails",gallery_path).to_s)
            image.write(File.join("thumbnails", gallery_path, basename+"_reduced."+name[1]).to_s)#TODO _site/ #TODO _reduced variable global?
          end
        
        end
      end

      def generate(site)
        '''
        site.categories.each do |category, posts|
          site.pages << GalleryPage.new(site, category, posts)
        end
        '''
        
        config = site.config["gallerytags"] || {}
        
        self.prepare(site,config)
        
        photo_dir = config["dir"]
        
        Dir.glob photo_dir+'/*' do |gallery_dir|
          gallery_path = gallery_dir
          site.pages << GalleryPage2.new(site, photo_dir, gallery_dir.split('/').last, gallery_path)
        end
        
      end
    end
    
    
    class GalleryPage2 < Jekyll::Page
    
      def get_month(month_index)
      	#months = ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"]
      	#return months[month_index.to_i-1]#TODO fix so that it is int by default
      	return month_index
      end
    
      def initialize(site, photo_dir, tag_name, gallery_path)

        @site = site             # the current site instance.
        @base = site.source      # path to the source directory.
        @dir  = photo_dir              # the directory the page will reside in.

        @basename = 'allposts2/'+tag_name      
        @ext      = '.html'   
        @name     = 'index2.html' 
        
        @image_blocks = []
        @thumbnail_blocks = []
        @date_block = []
        
        @images = []
        @thumbnails = []
        
        allJson = []
        #load up all the image data and sort it
         
        Dir.glob gallery_path+'/result.yml' do |info_file2|
           print info_file2
           allJson = YAML.load_file(info_file2)
        end
        
        allJson.sort_by! { |a| [-a ['year'].to_i, -a['month'].to_i ]  }
        
        current_date = ''
        last_date = ''
        current_block = []
        current_thumbnail_block = []
        allJson.each{ |item|
          
          img_dir = item['name']# |img_dir|#TODO only JPGs...
          if img_dir == '.' || img_dir == '..'
             next          
          end
          
          name = img_dir.split(".")
          if name.length() != 2
            next
          end
          @images.push(File.join(gallery_path,name[0]).to_s)
          @thumbnails.push(File.join("thumbnails",gallery_path,name[0]+"_reduced."+name[1]).to_s)
          
          last_date = (item['year']+'-'+get_month(item['month']))
          
          if(current_date === '')
             current_date = last_date
             @date_block.push(current_date)#off by one situation here
          end
          if( not ( last_date === current_date ) )
             @image_blocks.push(current_block)
             @thumbnail_blocks.push(current_thumbnail_block)
             @date_block.push(current_date)
             current_date = last_date
             current_block = []
             current_thumbnail_block = []
          end
          current_block.push(File.join(gallery_path,name[0]).to_s)
          #TODO: the path name should be decided on if it is or is not "_reduced" format
          current_thumbnail_block.push(File.join("thumbnails",gallery_path,name[0]+"_reduced."+name[1]).to_s) 
        }
        
        @image_blocks.push(current_block)
        @thumbnail_blocks.push(current_thumbnail_block)
        @date_block.push(current_date)

        self.content = File.read( File.join(@base.to_s, "_plugins/index2.html") )
	
      	self.data = {
	 'layout' => 'default',
	 'title' => "Title",
	 'images' => @images,
	 'thumbnails' => @thumbnails,
	 'image_blocks' => @image_blocks,
	 'date_block' => @date_block
     	}
     	
      end
    end
    
    
  end
