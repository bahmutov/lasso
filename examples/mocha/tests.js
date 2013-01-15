describe('foo', function(){
  describe('sanity', function(){
    
    it('foo should be a function', function(){
      assert.equal('function', typeof foo);
    })

    it('should return foo', function () {
    	assert.equal('foo', foo());
    })
  })
})