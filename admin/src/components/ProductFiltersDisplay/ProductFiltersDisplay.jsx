import React from 'react';

import InputField from '../../../../frontend/src/components/InputField/InputField';

const ProductFiltersDisplay = ({ activeFields, filters, formik }) => {
	return (
		<div className="product-details">
			<div className="additional-info">
				<h2>Product Details (Case-sensitive):</h2>
				<div className="seperator-line"></div>
			</div>

			{activeFields.map((field, index) => (
				<>
					<InputField
						key={index}
						type="text"
						name={field}
						placeholder={field}
						value={formik.values[field]}
						onChange={(e) => {
							formik.setFieldValue(field, e.target.value);
						}}
						onBlur={formik.handleBlur}
						errors={formik.errors[field]}
						touched={formik.touched[field]}
					/>
					<div className="previous-filters" key={field + '-' + index}>
						{filters &&
							filters != [] &&
							Array.from(Object.values(filters[index])[0]).map((el) => {
								return (
									<div
										className="previous-filter"
										onClick={() => formik.setFieldValue(field, el)}
										key={index + '-' + el}
									>
										<p>{el}</p>
									</div>
								);
							})}
					</div>
				</>
			))}
		</div>
	);
};

export default ProductFiltersDisplay;
