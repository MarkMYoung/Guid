//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
/**
 * Emulates some of Microsoft's .NET Guid API 
 *	(except that member letter case follows JavaScript conventions).
 *
 * @author Mark M. Young
 * @variant 1.2
 * date 2012-01-11
 * @see <a href="http://en.wikipedia.org/wiki/Globally_unique_identifier">GUID information</a>
 * @see <a href="http://msdn.microsoft.com/en-us/library/system.guid.aspx">Microsoft Guid API</a>
 * @see <a href="http://note19.com/2007/05/27/javascript-guid-generator/">GUID generator</a>
 * @see <a href="http://davidbau.com/encode/seedrandom.js">seedrandom</a>
 */
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
var Guid = (function( window, undefined )
{
function S4()
{return((((1 + Math.random()) * 0x10000) | 0).toString( 16 ).substring( 1 ));}
// Only tested against DCE variant.
function setVariant( uuidVariant )
{
	var data3_variant = this.bytes.slice( 6, 8 ).join( '' );
	var new_data3 = ''.concat(
		(window.parseInt( data3_variant.charAt( 0 ), 16 ) & uuidVariant.clearBits | uuidVariant.setBits).toString( 16 ),
		data3_variant.substr( 1, 3 )
	);
	var was_changed = new_data3 === data3_variant;
	this.bytes[ 6 ] = new_data3.substr( 0, 2 );
	this.bytes[ 7 ] = new_data3.substr( 2, 4 )
	return( was_changed );
}
// Only tested against Random version.
function setVersion( uuidVersion )
{
	var data4_version = this.bytes.slice( 8, 10 ).join( '' );
	var new_data4 = ''.concat( data4_version.substr( 0, 2 ),
		(window.parseInt( data4_version.charAt( 2 ), 16 ) & uuidVersion.clearBits | uuidVersion.setBits).toString( 16 ),
		data4_version.substr( 3, 1 )
	);
	var was_changed = new_data4 === data4_version;
	this.bytes[ 8 ] = new_data4.substr( 0, 2 );
	this.bytes[ 9 ] = new_data4.substr( 2, 4 )
	return( was_changed );
}
var Guid = function( a_string )
{
	this.bytes = null;//new Array( 16 );
	var string = a_string || Guid.EMPTY;
	var matches = Guid.REGULAR_EXPRESSION.exec( string );
	if( matches !== null && matches.length === 17 )
	{
		// matches[ 0 ] is the whole match, regardless.
		this.bytes = matches.slice( 1, 17 ).map( function to_lower_case( hex )
		{return( hex.toLowerCase());});
	}
	else
	{throw( new TypeError( "Unacceptable GUID value: '".concat( a_string, "'." )));}
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
};
Guid.prototype = new Object();
Guid.prototype.constructor = Guid;
Guid.prototype.compareTo = function( thatGuid )
{
	if( !(thatGuid instanceof Guid))
	{throw( new TypeError( "'thatGuid' parameter must be a Guid." ));}
	//var comparison = this.toString().localeCompare( thatGuid.toString());
	var this_value = this.valueOf();
	var that_value = thatGuid.valueOf();
	var comparison = (this_value < that_value)?(-1):((this_value > that_value)?(+1):(0));
	return( comparison );
};
Guid.prototype.equals = function( thatGuid )
{return( this.compareTo( thatGuid ) == 0 );};
Guid.prototype.toJSON 
	= Guid.prototype.toString 
	= Guid.prototype.valueOf 
	= function()
{
	return(
	[
		this.bytes.slice( 0, 4 ).join( '' ),
		this.bytes.slice( 4, 6 ).join( '' ),
		this.bytes.slice( 6, 8 ).join( '' ),
		this.bytes.slice( 8, 10 ).join( '' ),
		this.bytes.slice( 10, 16 ).join( '' ),
	].join( '-' ));
};
Guid.prototype.toByteArray = function()
{return( this.bytes.slice( 0 ));};
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
Guid.comparator = function( left, right )
{
	var comparison = (new Guid( left )).compareTo( new Guid( right ));
	return( comparison );
};
Guid.getVariant = function( aGuid )
{
	if( !(aGuid instanceof Guid))
	{throw( new TypeError( "'aGuid' parameter must be a Guid." ));}
	var uuid_variant = null;
	var data3_variant = window.parseInt( aGuid.toByteArray().slice( 6, 8 ).join( '' ).charAt( 0 ), 16 );
	['DCE'].forEach( function( variant, v )
	{
		if((data3_variant & Guid.UuidVariant[ variant ].setBits) === Guid.UuidVariant[ variant ].setBits )
		{uuid_variant = Guid.UuidVariant[ variant ].name;}
	}, Guid.UuidVariant );
	return( uuid_variant );
};
Guid.getVersion = function( aGuid )
{
	if( !(aGuid instanceof Guid))
	{throw( new TypeError( "'aGuid' parameter must be a Guid." ));}
	var uuid_version = null;
	var data4_version = window.parseInt( aGuid.toByteArray().slice( 8, 10 ).join( '' ).charAt( 2 ), 16 );
	['RANDOM'].forEach( function( version )
	{
		if((data4_version & Guid.UuidVersion[ version ].setBits) === Guid.UuidVersion[ version ].setBits )
		{uuid_version = Guid.UuidVersion[ version ].name;}
	}, Guid.UuidVersion );
	return( uuid_version );
};
Guid.newGuid = function()
{
	var data3_variant = S4();
	var data4_version = S4();
	var guid_str = ''.concat( S4(), S4(), '-', S4(), '-', data3_variant, '-', data4_version, '-', S4(), S4(), S4());
	var newGuid = new Guid( guid_str );
	var variant_was_changed = setVariant.apply( newGuid, [Guid.UuidVariant.DCE]);
	var version_was_changed = setVersion.apply( newGuid, [Guid.UuidVersion.RANDOM]);
	return( newGuid );
};
// Expose the regular expression used.
Object.defineProperty( Guid, 'REGULAR_EXPRESSION', 
	//var patterns =
	//[
	//	/([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/,
	//	/([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/,
	//	/{([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})}/,
	//	/\(([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})\)/,
	//	/{[ ]*(?:0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})(?:,[ ]*0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})(?:,[ ]*0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})(?:,[ ]*{[ ]*0x)([0-9A-Fa-f]{2})(?:,[ ]*0x)([0-9A-Fa-f]{2})(?:,[ ]*0x)([0-9A-Fa-f]{2})(?:,[ ]*0x)([0-9A-Fa-f]{2})(?:,[ ]*0x)([0-9A-Fa-f]{2})(?:,[ ]*0x)([0-9A-Fa-f]{2})(?:,[ ]*0x)([0-9A-Fa-f]{2})(?:,[ ]*0x)([0-9A-Fa-f]{2})[ ]*}[ ]*}/,
	//];
	// Pattern breaks up any GUID into 16 pieces to accommodate the hexadecimal bracketed variant.
	{'enumerable':true, 'value':/([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/, 'writable':false,
});

function UuidVariant(){}
UuidVariant.prototype = new Object();
UuidVariant.prototype.constructor = UuidVariant;
var dceVariant = new UuidVariant();
Object.defineProperties( dceVariant,
{
	// Variant bits to clear (00xx).
	'clearBits':{'enumerable':true, 'value':0x3, 'writable':false,},
	'name':{'enumerable':true, 'value':'DCE', 'writable':false,},
	// Variant bits to set for version, DCE (Distributed Computing Environment) (10x).
	'setBits':{'enumerable':true, 'value':0x8, 'writable':false,},
});
var uuidVariant = {};
Object.defineProperties( uuidVariant,
{
	'DCE':{'enumerable':true, 'value':dceVariant, 'writable':false,},
});
Object.defineProperty( Guid, 'UuidVariant', {'value':uuidVariant, 'writable':false,});

function UuidVersion(){}
UuidVersion.prototype = new Object();
UuidVersion.prototype.constructor = UuidVersion;
var randomVersion = new UuidVersion();
Object.defineProperties( randomVersion,
{
	// Version bits to clear (0000).
	'clearBits':{'enumerable':true, 'value':0x0, 'writable':false,},
	'name':{'enumerable':true, 'value':'Random', 'writable':false,},
	// Version bits to set for variant, 'Random'.
	'setBits':{'enumerable':true, 'value':0x4, 'writable':false,},
});
var uuidVersion = {};
Object.defineProperties( uuidVersion,
{
	'RANDOM':{'enumerable':true, 'value':randomVersion, 'writable':false,},
});
Object.defineProperty( Guid, 'UuidVersion', {'value':uuidVersion, 'writable':false,});
// EMPTY must wait to be defined after the other properties are defined (because it instantiates a Guid).
Object.defineProperty( Guid, 'EMPTY', {'enumerable':true, 'value':new Guid( '00000000-0000-0000-0000-000000000000' ), 'writable':false,});
return( Guid );
})( window );
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//