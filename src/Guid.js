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
var Guid = (function( undefined )
{
function S4()
{	// http://note19.com/2007/05/27/javascript-guid-generator/
	return((((1 + Math.random()) * 0x10000) | 0).toString( 16 ).substring( 1 ));
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
	var this_value = this.valueOf();
	var that_value = thatGuid.valueOf();
	//var comparison = (this_value < that_value)?(-1):((this_value > that_value)?(+1):(0));
	var comparison = this.toString().localeCompare( thatGuid.toString());
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
var VERSION_VALUE = 0x4;// Version bits to set.
var VERSION_CLEAR = 0x0;// Version bits to clear.
var VARIANT_VALUE = 0x8;// Variant bits to set for Standard variant (10x).
var VARIANT_CLEAR = 0x3;// Variant bits to clear.
Guid.newGuid = function()
{
	var data3_version = S4();
	data3_version = ''.concat(
		(parseInt( data3_version.charAt( 0 ), 16 ) & VERSION_CLEAR | VERSION_VALUE).toString( 16 ),
		data3_version.substr( 1, 3 )
	);
	var data4_variant = S4();
	data4_variant = data4_variant.substr( 0, 2 ).concat(
		(parseInt( data4_variant.charAt( 2 ), 16 ) & VARIANT_CLEAR | VARIANT_VALUE).toString( 16 ),
		data4_variant.substr( 3, 1 )
	);
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
// EMPTY must wait to be defined after the regular expression is defined.
Object.defineProperty( Guid, 'EMPTY', {'enumerable':true, 'value':new Guid( '00000000-0000-0000-0000-000000000000' ), 'writable':false,});
return( Guid );
})();