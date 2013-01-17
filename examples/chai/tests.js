var expect = chai.expect;

describe('foo', function(){
	describe('sanity', function(){
		
		it('foo should be a function', function(){
			expect(foo).to.be.a('function');
		})

		it('should return foo', function () {
			expect(foo()).to.equal('foo');
		})
	})
})