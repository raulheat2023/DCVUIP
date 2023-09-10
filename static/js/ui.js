/* global $ */
var selectedModel,
    childs,
    modelIds = [],
    assets = {},
    searchParams = (new URL(document.location.toString())).searchParams,
	  diffView = "k"

 
// ===== Script to get the the server URL =====
/*

const url = "https://version-integ.nextfloor.com/api/api_version/getClientVersionInfo"

const globalOptions = {
    method: 'POST',
    body: "gameCd=DCG&os=android&clientVersion=2.9.5",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

const koreanOptions = {
    method: 'POST',
    body: "packageSignature=34%3A77%3A71%3AAD%3A8B%3A73%3A24%3A15%3A7F%3A65%3A85%3A4E%3A9B%3ADB%3A4A%3AD9%3AE5%3A5C%3A96%3A81&gameCd=DC&os=android&clientVersion=2.9.5",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
}

fetch(url,globalOptions,)
    .then(res => res.json())
    .then(resData => console.log(`const globalURL = "${resData.data.patch_addr}"`))

fetch(url,koreanOptions)
    .then(res => res.json())
    .then(resData => console.log(`const krURL = "${resData.data.patch_addr}"`))

*/

const globalURL = "https://patch.real.dcgl.shiftupcorp.com/real.203.gx3e0era1ndd/"
const krURL = "https://patch.real.dckr.shiftupcorp.com/real.170.z75lr26owob1/"

function getSelectedIndex() {
  return modelIds.indexOf(selectedModel)
}

function GView() {
	document.getElementById("note").innerHTML = "Viewing Global's censored version of the game";
	diffView = "g";
	updateViewer();
}

function KView() {
	document.getElementById("note").innerHTML = "Viewing Korean's uncensored version of the game";
	diffView = "k";
	updateViewer();
}


function updateViewer(id) {
  if(id && typeof id == 'string') selectedModel = id
  var viewer = document.getElementsByTagName('iframe')[0],
    size = $('#size-slider').slider('value'),
	  mS = $('#scale-slider').slider('value'), 
	  mX = $('#offsetX-slider').slider('value'), 
	  mY = $('#offsetY-slider').slider('value')
  var code = null
  var download = null
  var shareLink = "https://live2d-dcg.github.io/?model=" + selectedModel
  
  if (diffView == "k") {
	  viewer.src = 'viewerK.html?mN=' + selectedModel + '&size=' + size + '&mS=' + mS  + '&mX=' + mX  + '&mY=' + mY
	  code = viewer.outerHTML.replace('viewerk.html', document.location.toString() + 'viewerk.html')
	  download = krURL + "hd_android/asset/character/" + selectedModel +".pck"
	  
  } else {
	  viewer.src = 'viewer.html?mN=' + selectedModel + '&size=' + size + '&mS=' + mS  + '&mX=' + mX  + '&mY=' + mY
	  code = viewer.outerHTML.replace('viewer.html', document.location.toString() + 'viewer.html')
	  download = globalURL + "hd_mobile/asset/character/" + selectedModel +".pck"
	  
  }
  

  
  if (diffView == 'k'){
	  $('#Uncensored').addClass("ui-button ui-corner-all ui-widget ui-button-disabled ui-state-disabled")
	  $('#Censored').removeClass("ui-button-disabled ui-state-disabled")
  } else {
	  $('#Uncensored').removeClass("ui-button-disabled ui-state-disabled")
	  $('#Censored').addClass("ui-button ui-corner-all ui-widget ui-button-disabled ui-state-disabled")
  }
  
  /*if (diffView == 'k'){
	  $('#Uncensored').attr("disabled", true);
	  $('#Censored').attr("disabled", false);
  } else {
	  $('#Uncensored').attr("disabled", false);
	  $('#Censored').attr("disabled", true);
  }*/
  
  viewer.style.width = size + 'px'
  viewer.style.height = 'calc(100vh + 150px)'
  viewer.style.scale = mS

  $('#direct-link').attr('href', viewer.src)
  $('#direct-link').html(viewer.src)
  $('#share-link').attr('href', shareLink)
  $('#share-link').html(shareLink)
  $('#download-link').attr('href', download)
  $('#download-link').html("Download " + selectedModel  +".pck")
  
  var i = getSelectedIndex()
  $('#previous').button(i > 0 ? 'enable' : 'disable')
  $('#next').button(i < modelIds.length - 1 ? 'enable' : 'disable')
  
}

function loadChilds(callback) {
  $.getJSON('static/json/child_list.json', function(_childs) {
    childs = _childs
    callback()
  })
}
function getChild(id) {
  return childs[id.split('_')[0]]
}
function getName(id) {
  var child = getChild(id)
  return child && child.name || '???'
}
function getDesc(id) {
  var child = getChild(id)
  return child && child.description || 'empty'
}

function getAttr(id) {
  var child = getChild(id)
  return child && child.attribute || 'water'
}

function getType(id) {
  var child = getChild(id)
  return child && child.type || 'attack'
}

function getStar(id) {
  var child = getChild(id)
  return child && child.stars || 'three'
}

function getLabel(id) {
  var parts = id.split('_'),
      child = getChild(id),
      v = parts[1].replace(/-.+$/, ''),
      variant = child && child.variants[v],
      name = getName(id)
  return (child
    ? ((variant && variant.title)
      ? variant.title + ' ' + name : name
    )
    : name
  )
}

function getDescription(id) {
  var parts = id.split('_'),
      child = getChild(id),
      v = parts[1].replace(/-.+$/, ''),
      variant = child && child.variants[v],
      description = getDesc(id)
  return (child
    ? ((variant && variant.description)
      ? variant.description : description
    )
    : description
  )
}

function getAttributes(id) {
  var parts = id.split('_'),
      child = getChild(id),
      v = parts[1].replace(/-.+$/, ''),
      variant = child && child.variants[v],
      attribute = getAttr(id)
  return (child
    ? ((variant && variant.attribute)
      ? variant.attribute : attribute
    )
    : attribute
  )
}

function getTypes(id) {
  var parts = id.split('_'),
      child = getChild(id),
      v = parts[1].replace(/-.+$/, ''),
      variant = child && child.variants[v],
      type = getType(id)
  return (child
    ? ((variant && variant.type)
      ? variant.type : type
    )
    : type
  )
}

function getStars(id) {
  var parts = id.split('_'),
      child = getChild(id),
      v = parts[1].replace(/-.+$/, ''),
      variant = child && child.variants[v],
      type = getStar(id)
  return (child
    ? ((variant && variant.stars)
      ? variant.stars : stars
    )
    : stars
  )
}

function loadAssets(callback) {
  $.getJSON('static/json/assets_childsonly.json', function(data) {
    $.each(data, function(i, asset) {
      var id = asset.id
      selectedModel = selectedModel || id
      modelIds.push(id)
      assets[id] = asset
      $('#select').append(
        '<option value="' + id + '" label="'+ getDescription(id) +'" data-attr="'+ getAttributes(id) +'" data-type="'+ getTypes(id) +'" data-stars="'+ getStars(id) +'">' + getLabel(id) + '</option>'
      ),
      $('#childButtons').append(
        '<button data-attr="'+ getAttributes(id) +'" data-id="'+ id +'" data-name="'+ getLabel(id) +'" data-value="'+ getDescription(id) +'" data-type="'+ getTypes(id) +'" data-stars="'+ getStars(id) +'" onclick="changeChilds(this)" class="childbutton item '+ id +'"><span class="selected-indicator"></span><span class="background"></span></button>'
      )
    })
    callback()
  })
}

//combo-box
function createComboBox() {
  $.widget('custom.combobox', {
    _create: function() {
      this.wrapper = $('<span>').addClass('custom-combobox').insertAfter( this.element )
      this.element.hide()
      this._createAutocomplete()
      this._createShowAllButton()
    },

    _createAutocomplete: function() {
      var selected = this.element.children(':selected'),
          value = selected.val() ? selected.text() : ''

      this.input = $('<input>')
        .appendTo( this.wrapper )
        .val( value )
        .attr('title', '')
        .addClass('custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left')
        .autocomplete({
          delay: 0,
          minLength: 0,
          source: $.proxy( this, '_source')
        })
        .tooltip({classes: {'ui-tooltip': 'ui-state-highlight'}})

      this._on( this.input, {
        autocompleteselect: function( event, ui ) {
          childname = ui.item.option.label
          ui.item.option.selected = true
          this._trigger('select', event, {
            item: ui.item.option
          })
          var attribute = ui.item.option.getAttribute('data-attr');
          var type = ui.item.option.getAttribute('data-type');
          var stars = ui.item.option.getAttribute('data-stars');
          console.log(attribute)
          document.getElementById("childName").innerHTML = ui.item.label; 
          document.getElementById("childDesc").innerHTML = childname; 
          document.getElementById("attribute").removeAttribute('class');
          document.getElementById("attribute").classList.add(attribute);
          document.getElementById("type").removeAttribute('class');
          document.getElementById("type").classList.add(type);
          document.getElementById("stars").removeAttribute('class');
          document.getElementById("stars").classList.add(stars);
        },
        autocompletechange: '_removeIfInvalid'
      })
    },
    _createShowAllButton: function() {
      var input = this.input,
          wasOpen = false

      $('<a>')
        .attr('tabIndex', -1 )
        .appendTo( this.wrapper )
        .button({
          icons: {
            primary: 'ui-icon-triangle-1-s'
          },
          text: false
        })
        .removeClass('ui-corner-all')
        .addClass('custom-combobox-toggle ui-corner-right')
        .on('mousedown', function() {
          wasOpen = input.autocomplete('widget').is(':visible')
        })
        .on('click', function() {
          input.trigger('focus')
          if(wasOpen) return // Close if already visible
          input.autocomplete('search', '') // Pass empty string as value to search for, displaying all results
        })
    },

    _source: function( request, response ) {
      var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), 'i')
      response(this.element.children('option').map(function() {
        var text = $( this ).text()
        if( this.value && ( !request.term || matcher.test(text) ) ) {
          return {
            label: text,
            value: text,
            option: this,
          }
        }
      }) )
    },
    _removeIfInvalid: function( event, ui ) {

      if(ui.item) return // Selected an item, nothing to do

      // Search for a match (case-insensitive)
      var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false
      this.element.children('option').each(function() {
        if( $( this ).text().toLowerCase() === valueLowerCase ) {
          this.selected = valid = true
          return false
        }
      })

      if(valid) return// Found a match, nothing to do

      // Remove invalid value
      this.input
        .val('')
        .attr('title', value + ' didn\'t match any item')
        .tooltip('open')
      this.element.val('')
      this._delay(function() {
        this.input.tooltip('close').attr('title', '')
      }, 2500 )
      this.input.autocomplete('instance').term = ''
    },
    _destroy: function() {
      this.wrapper.remove()
      this.element.show()
    }
  })
  $('select').combobox({
    select: function() {
      updateViewer(this.value);

    }
  })
  $('select').on('change', function() { 
    updateViewer(this.value);
  })
}

//Child buttons
let changeChilds = button => {
  var id = button.getAttribute('data-id');
  var value = button.getAttribute('data-value');
  var name = button.getAttribute('data-name');
  var attr = button.getAttribute('data-attr');
  var type = button.getAttribute('data-type');
  var star = button.getAttribute('data-stars');
  console.table(type)

  updateViewer(id);
    document.addEventListener('click', function handleClick(event) {
      event.target.classList.add('selected');
    });
    document.getElementById("childName").innerHTML = name;
    document.getElementById("childDesc").innerHTML = value;
    document.getElementById("attribute").removeAttribute('class');
    document.getElementById("attribute").classList.add(attr);
    document.getElementById("type").removeAttribute('class');
    document.getElementById("type").classList.add(type);
    document.getElementById("stars").removeAttribute('class');
    document.getElementById("stars").classList.add(star);
}

function createSlider() {
  var maxWidth = 1970,
      docWidth = $(document).width()
      minWidth = docWidth,
  $('#size-slider').slider({
    min: minWidth,
    max: docWidth < maxWidth ? docWidth : maxWidth,
    step: 50,
    value: searchParams.get('size') || screen.height/1.5,
    slide: function(_, ui) {
      $('#size-label').html(ui.value)
    },
    change: updateViewer
  })
  $('#size-label').html($('#size-slider').slider('value'))
}

function createScaleSlider() {
  $('#scale-slider').slider({
    min: 0.1,
    max: 3,
    step: 0.1,
    value: searchParams.get('scale') || 0.9,
    slide: function(_, ui) {$('#scale-label').html(ui.value) },
    change: updateViewer
  })
  $('#scale-label').html($('#scale-slider').slider('value'))
  }
  
function createOffsetXSlider() {
  $('#offsetX-slider').slider({
    min: -1.5,
    max: 1.5,
    step: 0.1,
    value: searchParams.get('offsetX') || 0,
    slide: function(_, ui) {
      $('#offsetX-label').html(ui.value)
    },
    change: updateViewer
  })
  $('#offsetX-label').html($('#offsetX-slider').slider('value'))
  }
  
function createOffsetYSlider() {
  $('#offsetY-slider').slider({
    min: 0.3,
    max: 1.5,
    step: 0.1,
    value: searchParams.get('offsetY') || 0,
    slide: function( event, ui ) {
        $('#offsetY-label').html(ui.value)
      },
    change: updateViewer
  })
  $('#offsetY-label').html($('#offsetY-slider').slider('value'))
  }
  
function setSelectedIndex(i) {
  $('select option').eq(i).prop('selected', true)
  var $select = $('select'),
      id = $select.val()
  updateViewer(id)
  $select.combobox('instance').input.val(getLabel(id));
}
function init() { // eslint-disable-line no-unused-vars
  loadChilds(function() {
    loadAssets(function() {
      createComboBox()
      createSlider()
	  createScaleSlider()
	  createOffsetXSlider()
	  createOffsetYSlider()
      $('#previous').button()
      $('#previous').click(function() { setSelectedIndex(getSelectedIndex() - 1) })
      $('#next').button()
      $('#next').click(function() { setSelectedIndex(getSelectedIndex() + 1) })
      var model = searchParams.get('model')
      var modelIndex = modelIds.indexOf(model)
      if(modelIndex > -1) setSelectedIndex(modelIndex)
      else updateViewer()
      $('#loading').hide()
      $('#ui').show()
    })
  })
}


//Clear screen
function clearScreen() {
  var element = document.body;
  element.classList.toggle("clear");
}

//Background selector
$(document).on('ready', function () {
  $.getJSON("static/json/backgrounds.json", function (data) {
    $.each(data, function (bgid, bgid, bgimage, type) {
      
      $("#backgroundSelector").append('<button id="'+ bgid.bgid +'" class="bg-btn"></button>');
      var bgimagecode = document.getElementById(bgid.bgid);
      var bgclasstype = (bgid.type);
      var bgimageimage = "url(static/images/" + (bgid.bgimage) + ")";
      bgimagecode.addEventListener('click', function onClick(event){
        console.log(bgimageimage)
        document.getElementById("background").style.backgroundImage = bgimageimage;
        document.getElementById("background").className = bgclasstype;
        console.log(bgclasstype);
      })
    })
  })
})

//reset panzoom
function resetpanzoom() {
  panzoom(element, {
    initialX: 500,
    initialY: 500,
    initialZoom: 1,
  })
}