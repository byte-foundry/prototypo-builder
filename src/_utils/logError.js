export default function( error ) {
  if ( error instanceof Error && typeof console !== undefined ) {
    /* eslint-disable no-console */
    console.error( error );
    /* eslint-enable no-console */
  }
}
