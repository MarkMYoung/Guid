//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
/**
 * Emulates some of Microsoft's .NET Guid API 
 *	(except that member letter case follows JavaScript conventions).
 *
 * @author Mark M. Young
 * @version 1.2
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
{	// http://note19.com/2007/05/27/javascript-guid-generator/
	return((((1 + Math.random()) * 0x10000) | 0).toString( 16 ).substring( 1 ));
}
function setVersion( data3_version, uuidVersion )
{// Only tested against DCE version.
	return( ''.concat(
		(window.parseInt( data3_version.charAt( 0 ), 16 ) & uuidVersion.clear | uuidVersion.value).toString( 16 ),
		data3_version.substr( 1, 3 )
	));
}
function setVariant( data4_variant, uuidVariant )
{// Only tested against Random variant.
	return( data4_variant.substr( 0, 2 ).concat(
		(window.parseInt( data4_variant.charAt( 2 ), 16 ) & uuidVariant.clear | uuidVariant.value).toString( 16 ),
		data4_variant.substr( 3, 1 )
	));
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
	{throw( new TypeError( "Unacceptable GUID value: \"".concat( a_string, "\"." )));}
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//
};
Guid.prototype = new Object();
Guid.prototype.constructor = Guid;
Guid.prototype.compareTo = function( thatGuid )
{
	if( !(thatGuid instanceof Guid))
	{throw( new TypeError( "Guid.compareTo parameter must be a Guid." ));}
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
Guid.newGuid = function()
{
	var data3_version = S4();
	data3_version = setVersion( data3_version, Guid.UuidVersion.DCE );
	var data4_variant = S4();
	data4_variant = setVariant( data4_variant, Guid.UuidVariant.RANDOM );
	var guid_str = S4().concat( S4(), '-', S4(), '-', data3_version, '-', data4_variant, '-', S4(), S4(), S4());
	return( new Guid( guid_str ));
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
	// Pattern breaks up any GUID into 16 pieces to accommodate the hexadecimal bracketed version.
	{'enumerable':true, 'value':/([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})-?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/, 'writable':false,
});

function UuidVersion(){}
UuidVersion.prototype = new Object();
UuidVersion.prototype.constructor = UuidVersion;
var dceVersion = new UuidVersion();
Object.defineProperties( dceVersion,
{
	// Version bits to clear (00xx).
	'clear':{'enumerable':true, 'value':0x3, 'writable':false,},
	// Version bits to set for variant, DCE (Distributed Computing Environment) (10x).
	'value':{'enumerable':true, 'value':0x8, 'writable':false,},
});
var uuidVersion = {};
Object.defineProperties( uuidVersion,
{
	'DCE':{'enumerable':true, 'value':dceVersion, 'writable':false,},
});
Object.defineProperty( Guid, 'UuidVersion', {'value':uuidVersion, 'writable':false,});

function UuidVariant(){}
UuidVariant.prototype = new Object();
UuidVariant.prototype.constructor = UuidVariant;
var randomVariant = new UuidVariant();
Object.defineProperties( randomVariant,
{
	// Variant bits to clear (0000).
	'clear':{'enumerable':true, 'value':0x0, 'writable':false,},
	// Variant bits to set for version, 'Random'.
	'value':{'enumerable':true, 'value':0x4, 'writable':false,},
});
var uuidVariant = {};
Object.defineProperties( uuidVariant,
{
	'RANDOM':{'enumerable':true, 'value':randomVariant, 'writable':false,},
});
Object.defineProperty( Guid, 'UuidVariant', {'value':uuidVariant, 'writable':false,});
// EMPTY must wait to be defined after the other properties are defined.
Object.defineProperty( Guid, 'EMPTY', {'enumerable':true, 'value':new Guid( '00000000-0000-0000-0000-000000000000' ), 'writable':false,});
return( Guid );
})( window );