$(document).ready( function()
{
	QUnit.module( "Guid" );
	QUnit.test( "Constructor(s)", function( qUnit )
	{
		QUnit.expect( 3 );
		QUnit.strictEqual( new Guid().toString(), Guid.EMPTY.toString(),
			"Default GUID value should be a zero GUID." );
		QUnit.strictEqual( new Guid( 'CA761232-ED42-11CE-BACD-00AA0057B223' ).toString(), new Guid( 'ca761232-ed42-11ce-bacd-00aa0057b223' ).toString(),
			"GUIDs should be case insensitive." );
		QUnit.throws
		(
			function()
			{
				new Guid( 'CA761232ED42-11CE-BACD-00AA-0057B223' ).toString();
			},
			function( exc )
			{
				return( exc instanceof TypeError );
			},
			"Specifying an invalid GUID should raise a TypeError exception."
		);
	});
	QUnit.test( "Object member(s)", function( qUnit )
	{
		QUnit.expect( 1 );
		var guid = new Guid( 'CA761232-ED42-11CE-BACD-00AA0057B223' );
		QUnit.strictEqual( guid.toString(), guid.valueOf(),
			"Default values of .toString and .valueOf should be identical." );
	});
	QUnit.test( "Static member(s)", function( qUnit )
	{
		QUnit.expect( 2 );
		QUnit.strictEqual( Guid.EMPTY.toString(), '00000000-0000-0000-0000-000000000000',
			".EMPTY value should be a zero GUID." );
		QUnit.notStrictEqual( Guid.newGuid().toString(), Guid.EMPTY.toString(),
			".newGuid should produce a non-zero GUID." );
	});
	QUnit.test( "Special requirements", function( qUnit )
	{
		QUnit.expect( 2 );
		var version_index = 14;
		var version_value = 0x8;
		QUnit.strictEqual( parseInt( Guid.newGuid().toString().charAt( version_index ), 16 ) & version_value, version_value,
			"Value should indicate a 'DCE (Distributed Computing Environment)' version GUID." );

		var variant_index = 21;
		var variant_value = 0x4;
		QUnit.strictEqual( parseInt( Guid.newGuid().toString().charAt( variant_index ), 16 ) & variant_value, variant_value,
			"Value should indicate a 'Random' variant GUID." );
	});
});