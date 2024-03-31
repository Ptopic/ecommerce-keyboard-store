import React, { useState } from 'react';

import InputField from '../../../../frontend/src/components/InputField/InputField';

import { generateFilterProductAdmin } from '../../../../frontend/src/utils/filters';

const ProductFiltersDisplay = ({ activeFields, filters, formik }) => {
	return (
		<div className="product-details">
			{activeFields && activeFields.length > 0 && (
				<div className="additional-info">
					<h2>Product Details (Case-sensitive):</h2>
					<div className="seperator-line"></div>
				</div>
			)}

			{activeFields?.map((field, index) => (
				<>
					<InputField
						key={index}
						type="text"
						name={Object.keys(field)}
						placeholder={Object.keys(field)}
						value={formik.values[Object.keys(field)]}
						onChange={(e) => {
							formik.setFieldValue(Object.keys(field), e.target.value);
						}}
						onBlur={formik.handleBlur}
						errors={formik.errors[Object.keys(field)]}
						touched={formik.touched[Object.keys(field)]}
					/>
					<div className="previous-filters">
						{filters &&
							filters.length > 0 &&
							Object.values(filters[index])[0].map((el) => {
								return (
									<div
										className="previous-filter"
										onClick={() => formik.setFieldValue(Object.keys(field), el)}
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
