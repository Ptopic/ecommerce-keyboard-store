import './featuredInfo.css';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';

export default function FeaturedInfo({
	sales,
	salesPercentage,
	usersCount,
	usersPercentage,
	ordersCount,
	ordersPercentage,
}) {
	return (
		<div className="featured">
			<div className="featuredItem">
				<span className="featuredTitle">Sales</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">€{sales}</span>
					<span className="featuredMoneyRate">
						{salesPercentage > 0 ? (
							<>
								{salesPercentage} <ArrowUpward className="featuredIcon" />
							</>
						) : (
							<>
								{salesPercentage}
								<ArrowDownward className="featuredIcon negative" />
							</>
						)}
					</span>
				</div>
				<span className="featuredSub">Compared to last month</span>
			</div>
			<div className="featuredItem">
				<span className="featuredTitle">Users</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">{usersCount}</span>
					<span className="featuredMoneyRate">
						{usersPercentage > 0 ? (
							<>
								{usersPercentage} <ArrowUpward className="featuredIcon" />
							</>
						) : (
							<>
								{usersPercentage}
								<ArrowDownward className="featuredIcon negative" />
							</>
						)}
					</span>
				</div>
				<span className="featuredSub">Compared to last month</span>
			</div>
			<div className="featuredItem">
				<span className="featuredTitle">Orders</span>
				<div className="featuredMoneyContainer">
					<span className="featuredMoney">{ordersCount}</span>
					<span className="featuredMoneyRate">
						{ordersPercentage > 0 ? (
							<>
								{ordersPercentage} <ArrowUpward className="featuredIcon" />
							</>
						) : (
							<>
								{ordersPercentage}
								<ArrowDownward className="featuredIcon negative" />
							</>
						)}
					</span>
				</div>
				<span className="featuredSub">Compared to last month</span>
			</div>
		</div>
	);
}
