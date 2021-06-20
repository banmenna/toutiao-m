// postcss.config.js
//基于Node.js
module.exports = {
    plugins: {
        //px->rem
        'postcss-pxtorem': {
            rootValue: 37.5,
            propList: ['*'],
        },
    },
};