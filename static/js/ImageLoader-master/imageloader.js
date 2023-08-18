//image loader.
function ImageLoader( settings )
{
	// Constructor
	{
		this.imageCount = settings.images.length;
		this.images = new Array( this.imageCount );

		this.begun = false;

		this.onAllLoaded = null;
		if( settings.onAllLoaded !== undefined ) {
			this.onAllLoaded = settings.onAllLoaded;
		}
		this.onImageLoaded = null;
		if( settings.onImageLoaded !== undefined ) {
			this.onImageLoaded = settings.onImageLoaded;
		}

		for( let i = 0; i < this.imageCount; i++ )
		{
			let name = '';
			let id = 0;

			if( settings.images[i].name !== undefined ) {
				name = settings.images[i].name;
			}
			if( settings.images[i].id !== undefined ) {
				id = settings.images[i].id;
			}

			this.images[i] = new LoadImage( name, id, i, settings.images[i].file, this );
		}

		this.begun = true;
	}

	this.getImageByPosition = function( position ) {
		for( let i = 0; i < this.imageCount; i++ )
			if( position === this.images[i].position )
				if( this.images[i].loaded )
					return this.images[i].image;
				else
					return null; // Not loaded

		return undefined; // Not found
	}

	this.getImageById = function( id ) {
		for( let i = 0; i < this.imageCount; i++ )
			if( id === this.images[i].id )
				if( this.images[i].loaded )
					return this.images[i].image;
				else
					return null; // Not loaded

		return undefined; // Not found
	}

	this.getImageByName = function( name ) {
		for( let i = 0; i < this.imageCount; i++ )
			if( name === this.images[i].name )
				if( this.images[i].loaded )
					return this.images[i].image;
				else
					return null; // Not loaded

		return undefined; // Not found
	}

	this.loadedIds = function ( idArray ) {
		if( this.begun )
		{
			for( let j = 0; j < idArray.length; j++ )
				for( let i = 0; i < this.imageCount; i++ )
					if( idArray[j] === this.images[i].id )
						if( this.images[i].loaded === false )
							return false;

			return true;
		}

		return false;
	}

	this.loadedNames = function ( nameArray ) {
		if( this.begun )
		{
			for( let j = 0; j < nameArray.length; j++ )
				for( let i = 0; i < this.imageCount; i++ )
					if( nameArray[j] === this.images[i].name )
						if( this.images[i].loaded === false )
							return false;

			return true;
		}

		return false;
	}

	this.loadedAll = function() {
		if( this.begun )
		{
			for( let i = 0; i < this.imageCount; i++ )
				if( this.images[i].loaded === false )
					return false;

			return true;
		}

		return false;
	}

	this.setLoaded = function( position ) {
		for( let i = 0; i < this.imageCount; i++ )
			if( position === this.images[i].position )
			{
				this.images[i].Done();
				if( this.onImageLoaded != null )
					this.onImageLoaded( this.images[i].name, this.images[i].image );
			}

		if( checkComplete(this.images, this.imageCount) ) {
			if( this.onAllLoaded != null )
				this.onAllLoaded();
		}
	}

	function checkComplete(images, imageCount) {
		for( let i = 0; i < imageCount; i++ )
			if( !images[i].loaded )
				return false;

		return true;
	}

	function LoadImage( name, id, position, file, thisImageLoader )
	{
		this.name = name;
		this.id = id;
		this.position = position;
		this.file = file;
		this.loaded = false;

		this.image = new Image();
		this.image.onload = function() { thisImageLoader.setLoaded( position ); };

		this.image.src = this.file; // Set last.

		this.Done = function ()
		{
			this.loaded = true;
			this.image.onload = this.image.onabort = this.image.onerror = null;
		}
	}
}
