require 'mini_magick'
require 'fileutils'


  
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
          print(gallery_dir+"\n")
          
          gallery_path = gallery_dir
          site.pages << GalleryPage2.new(site, photo_dir, gallery_dir.split('/').last, gallery_path)
        end
        
      end
    end


#    class GalleryPage < Jekyll::Page
#      def initialize(site, category, posts)

#        @site = site             # the current site instance.
#        @base = site.source      # path to the source directory.
#        @dir  = category         # the directory the page will reside in.

#        @basename = 'allposts'      
#        @ext      = '.html'   
#        @name     = 'index.html'
        
#        self.content = File.read( File.join(@base.to_s, "_plugins/index.html") )

#      	self.data = {
#	'layout' => 'default',
#	'title' => "Title",
#	'posts' => posts
#     	}
     	
#      end
#    end
    
    
    
    class GalleryPage2 < Jekyll::Page
      def initialize(site, photo_dir, tag_name, gallery_path)

        @site = site             # the current site instance.
        @base = site.source      # path to the source directory.
        @dir  = photo_dir              # the directory the page will reside in.

        @basename = 'allposts2/'+tag_name      
        @ext      = '.html'   
        @name     = 'index2.html' 
        
        @images = []
        @thumbnails = []
        
        Dir.foreach(gallery_path) do |img_dir|#TODO only JPGs...
          if img_dir == '.' || img_dir == '..'
             next          
          end
          
          name = img_dir.split(".")
          if name.length() != 2
            next
          end
          
          @images.push(File.join(gallery_path,name[0]).to_s)
          @thumbnails.push(File.join("thumbnails",gallery_path,name[0]+"_reduced."+name[1]).to_s)
        end

        self.content = File.read( File.join(@base.to_s, "_plugins/index2.html") )
	
      	self.data = {
	 'layout' => 'default',
	 'title' => "Title",
	 'images' => @images,
	 'thumbnails' => @thumbnails
     	}
     	
      end
    end
    
    
  end
