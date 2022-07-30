import Blog from '../schemas/blogSchema.js'


export const createBlog = async (req, res, next) => {
    try {
        const { title, description, content, image, readTime, tags, isPublic } = req.body;
        if (!title || !description || !content || !image || !readTime  || !tags || !isPublic) {
            return res.status(400).json({
                message: 'Please fill all required fields'
            });
        };

        const url = title.toLowerCase().replaceAll(' ', '-');
        
        const alreadyExists = await Blog.findOne({url })
        if (alreadyExists) throw new Error("Please pick another title");


        const blog = await Blog.create({ url, ...req.body});

        return res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            blog
        });
    } 
    catch(err) {
        return next(err);
    }
}


export const editBlog = async (req, res, next) => {
    try {
        const { title, description, content, image, readTime, tags, isPublic } = req.body;
        if (!title || !description || !content || !image || !readTime  || !tags || !isPublic) {
            return res.status(400).json({
                message: 'Please fill all required fields'
            });
        };

        const url = title.toLowerCase().replaceAll(' ', '-');
        
        const alreadyExists = await Blog.findOne({ url });

        if (alreadyExists && String(alreadyExists._id) !== req.params.blogId) throw new Error("Please pick another title");

        const blog = await Blog.findByIdAndUpdate(req.params.blogId, {url, ...req.body});

        return res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            blog
        });
    }
    catch(err) {
        return next(err);
    }
}

